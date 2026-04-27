# 🧩 Real-Time 1 Million Checkboxes System

A scalable real-time system that allows users to interact with a large set of checkboxes, with support for high concurrency using WebSockets and Redis.

---

## 🚀 Overview

This project demonstrates how to build a **real-time distributed system** where multiple users can:

* Toggle checkboxes
* See updates instantly across clients
* Prevent spam via rate limiting
* Share state across servers using Redis

The system is designed with scalability in mind and can be extended to handle **up to 1 million checkboxes and high concurrent users**.

---

## 🏗️ Architecture

### Core Components

* **WebSocket Server (Socket.IO)**

  * Handles real-time communication between clients
  * Emits and listens to checkbox events

* **Redis**

  * Stores checkbox state
  * Acts as a shared data layer across instances
  * Enables Pub/Sub for event broadcasting

* **Rate Limiting Layer**

  * Prevents abuse by limiting requests per socket (5 seconds cooldown)

---

## ⚙️ Features

* ✅ Real-time checkbox synchronization
* ✅ Distributed state using Redis
* ✅ Pub/Sub for multi-server communication
* ✅ Rate limiting per user (socket-based)
* ✅ Scalable architecture
* ✅ Handles large datasets (up to 1M checkboxes)

---

## 📦 Data Model

Checkbox state is stored as:

```json
[false, true, false, ...]
```

Where:

* Index = checkbox ID
* Value = checked state (boolean)

---

## 🔄 Event Flow

### Client → Server

```text
client:checkbox:clicked
```

Payload:

```json
{
  "index": number,
  "checked": boolean
}
```

---

### Server → Client

* ✅ Success (broadcast via pub/sub)
* ❌ Rate limit hit:

```text
server:checkbox:too-many-request
```

---

## 🧠 How It Works

1. Client clicks a checkbox
2. Server checks rate limit
3. Server updates Redis state
4. Server publishes event via Redis Pub/Sub
5. Other clients receive updates in real time

---

## ⚠️ Limitations & Considerations

### 1. Rate Limiting

* Currently uses in-memory Map
* Not shared across multiple server instances

👉 Improvement: Use Redis-based rate limiting

---

### 2. Race Conditions

* Current implementation uses read-modify-write
* Concurrent updates may overwrite each other

👉 Improvement:

* Redis transactions (`WATCH/MULTI`)
* OR store each checkbox independently

---

### 3. Memory Usage

* Storing 1M checkboxes as an array can be heavy

👉 Improvement:

* Use bitmaps (`SETBIT/GETBIT` in Redis)
* Reduces memory drastically

---

### 4. Validation Missing

* Needs strict validation for:

  * index bounds
  * boolean values

---

## 📈 Scalability

### Current Capabilities

* Handles thousands of concurrent users
* Supports horizontal scaling with Redis Pub/Sub

### To Reach 1M Users

* Use:

  * Load balancer (NGINX)
  * Multiple Node.js instances
  * Redis cluster
  * Sticky sessions (for WebSockets)

---

## 🛠️ Tech Stack

* Node.js
* Socket.IO
* Redis (Valkey compatible)
* JavaScript (ES Modules)

---

## 🧪 Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start Redis

```bash
docker compose up -d
```

### 3. Start server

```bash
npm run dev
```

---

## 🔮 Future Improvements

* 🔹 Redis bitmap optimization
* 🔹 Distributed rate limiting
* 🔹 WebSocket clustering
* 🔹 Frontend virtualization (render only visible checkboxes)
* 🔹 Monitoring (Prometheus + Grafana)

---

## 💡 Key Learnings

* Handling real-time systems at scale
* Avoiding race conditions in distributed systems
* Efficient state management using Redis
* Importance of rate limiting

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Built as a learning project to explore **real-time scalability and system design**.
<br>
<strong>Hrishikesh Shanbhag<strong>
