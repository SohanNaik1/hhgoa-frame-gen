FROM golang:1.22 AS builder

WORKDIR /app

# Copy dependencies first for better cache
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -tags netgo -ldflags '-w -extldflags "-static"' -o hhgoa-app main.go

FROM alpine:latest

WORKDIR /app

# Copy the built binary and all necessary static assets
COPY --from=builder /app/hhgoa-app .
COPY --from=builder /app/cascade ./cascade
COPY --from=builder /app/index.html .
COPY --from=builder /app/script.js .
COPY --from=builder /app/logo.png .

# Expose the port
EXPOSE 80

# Run the Go app
CMD ["./hhgoa-app"]
