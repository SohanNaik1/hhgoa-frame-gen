FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy dependencies first for better cache
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build
COPY . .
RUN go build -o hhgoa-app main.go

FROM alpine:latest

WORKDIR /app

# Copy the built binary and all necessary static assets
COPY --from=builder /app/hhgoa-app .
COPY --from=builder /app/cascade ./cascade
COPY --from=builder /app/index.html .
COPY --from=builder /app/script.js .
COPY --from=builder /app/style.css .
COPY --from=builder /app/logo.png .
# Copy any other static assets (like fonts or images) if they exist
COPY --from=builder /app/*.ttf ./ 2>/dev/null || true
COPY --from=builder /app/*.woff2 ./ 2>/dev/null || true

# Expose the port
EXPOSE 8080

# Run the Go app
CMD ["./hhgoa-app"]
