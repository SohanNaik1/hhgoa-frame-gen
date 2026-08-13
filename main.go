package main

import (
	"fmt"
	"image"
	"image/draw"
	_ "image/gif"
	"image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"os"

	pigo "github.com/esimov/pigo/core"
)

var classifier *pigo.Pigo

func initPigo() {
	cascadeFile, err := os.ReadFile("cascade/facefinder")
	if err != nil {
		log.Fatalf("Error reading cascade file: %v", err)
	}

	p := pigo.NewPigo()
	classifier, err = p.Unpack(cascadeFile)
	if err != nil {
		log.Fatalf("Error unpacking cascade file: %v", err)
	}
}

func main() {
	initPigo()
	
	fs := http.FileServer(http.Dir("."))
	http.Handle("/", fs)
	http.HandleFunc("/api/crop", handleCrop)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Engine ignited. Listening on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleCrop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 20 MB max payload
	r.Body = http.MaxBytesReader(w, r.Body, 20<<20)
	if err := r.ParseMultipartForm(20 << 20); err != nil {
		http.Error(w, "File too large or invalid", http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Missing 'image' field", http.StatusBadRequest)
		return
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		http.Error(w, "Invalid image format", http.StatusBadRequest)
		return
	}

	bounds := img.Bounds()
	w_img := bounds.Dx()
	h_img := bounds.Dy()

	// 1. Convert image to grayscale for Pigo
	pixels := make([]uint8, w_img*h_img)
	for y := 0; y < h_img; y++ {
		for x := 0; x < w_img; x++ {
			c := img.At(x+bounds.Min.X, y+bounds.Min.Y)
			r, g, b, _ := c.RGBA()
			pixels[y*w_img+x] = uint8((0.299*float64(r) + 0.587*float64(g) + 0.114*float64(b)) / 256.0)
		}
	}

	// 2. Run Face Detection
	cParams := pigo.CascadeParams{
		MinSize:     20,
		MaxSize:     1000,
		ShiftFactor: 0.1,
		ScaleFactor: 1.1,
		ImageParams: pigo.ImageParams{
			Pixels: pixels,
			Rows:   h_img,
			Cols:   w_img,
			Dim:    w_img,
		},
	}
	dets := classifier.RunCascade(cParams, 0.0)
	dets = classifier.ClusterDetections(dets, 0.2)

	var face *pigo.Detection
	maxQ := float32(0.0)
	for i := 0; i < len(dets); i++ {
		if dets[i].Q > maxQ {
			maxQ = dets[i].Q
			face = &dets[i]
		}
	}

	// 3. Mathematical Center (Fallback)
	size := w_img
	if h_img < w_img {
		size = h_img
	}
	x0 := bounds.Min.X + (w_img-size)/2
	y0 := bounds.Min.Y + (h_img-size)/2

	// 4. Smart Crop (If Face Found)
	if face != nil {
		// Calculate a padded 1:1 box anchored around the face
		paddingFactor := 2.5 
		faceSize := int(float64(face.Scale) * paddingFactor)
		
		// Constrain maximum square size to image bounds
		if faceSize > w_img { faceSize = w_img }
		if faceSize > h_img { faceSize = h_img }
		
		size = faceSize
		
		// Center the box exactly on the face coordinates
		x0 = bounds.Min.X + face.Col - size/2
		y0 = bounds.Min.Y + face.Row - size/2
		
		// Shift box back inside bounds if it spills over edges
		if x0 < bounds.Min.X { x0 = bounds.Min.X }
		if y0 < bounds.Min.Y { y0 = bounds.Min.Y }
		if x0+size > bounds.Max.X { x0 = bounds.Max.X - size }
		if y0+size > bounds.Max.Y { y0 = bounds.Max.Y - size }
	}

	cropRect := image.Rect(x0, y0, x0+size, y0+size)

	cropped := image.NewRGBA(image.Rect(0, 0, size, size))
	draw.Draw(cropped, cropped.Bounds(), img, cropRect.Min, draw.Src)

	// Scale down large images to prevent mobile browser crashes
	maxSize := 1080
	if size > maxSize {
		scaled := image.NewRGBA(image.Rect(0, 0, maxSize, maxSize))
		scaleRatio := float64(size) / float64(maxSize)
		for y := 0; y < maxSize; y++ {
			for x := 0; x < maxSize; x++ {
				srcX := int(float64(x) * scaleRatio)
				srcY := int(float64(y) * scaleRatio)
				scaled.Set(x, y, cropped.At(srcX, srcY))
			}
		}
		cropped = scaled
	}

	w.Header().Set("Content-Type", "image/jpeg")
	err = jpeg.Encode(w, cropped, &jpeg.Options{Quality: 85})
	if err != nil {
		log.Printf("Error encoding jpeg: %v", err)
	}
}
