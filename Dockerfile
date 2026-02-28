# Go 1.21 sürümünü kullanarak go.mod ile tam uyum sağlıyoruz
FROM golang:1.21-alpine

# Çalışma dizinini oluştur
WORKDIR /app

# Önce modül dosyalarını kopyalayıp bağımlılıkları indirelim (önbellek avantajı sağlar)
COPY go.mod go.sum ./
RUN go mod download

# Kalan tüm kodları kopyala
COPY . .

# Uygulamayı derle
RUN go build -o main .

# Uygulamanın çalışacağı port
EXPOSE 8080

# Uygulamayı başlat
CMD ["./main"]