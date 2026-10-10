require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`[socket] client connected: ${socket.id}`);

    socket.on("join", ({ userId }) => {
        if (userId) {
            socket.join(userId);
        }
    });

    socket.on("disconnect", () => {
        console.log(`[socket] client disconnected: ${socket.id}`);
    });
});

app.set("io", io);

app.use(
    cors({
        origin: CLIENT_URL,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        credentials: true
    })
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/canteens", require("./routes/canteens"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/admin/stock", require("./routes/stock"));
app.use(
    "/api/admin/menu-ingredients",
    require("./routes/stock").recipeRouter
);
app.use("/api/voice", require("./routes/voice"));

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        db: sequelize.getDialect(),
        timestamp: new Date()
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: `Route ${req.method} ${req.path} not found.`
    });
});

app.use((err, req, res, next) => {
    console.error("[error]", err);

    res.status(500).json({
        error: err.message || "Internal server error"
    });
});

sequelize
    .authenticate()
    .then(async () => {
        console.log(`[db] ${sequelize.getDialect()} connected`);

        if (sequelize.getDialect() === "sqlite") {
            await sequelize.sync();
        } else {
            await sequelize.sync({ alter: true });
        }

        // Safe auto-migration: ensure status column exists on canteens table
        try {
            const queryInterface = sequelize.getQueryInterface();
            const tableDesc = await queryInterface.describeTable("canteens");
            if (!tableDesc.status) {
                console.log("[db] Adding status column to canteens table...");
                await queryInterface.addColumn("canteens", "status", {
                    type: sequelize.Sequelize.STRING(20),
                    defaultValue: "active",
                    allowNull: false,
                });
                console.log("[db] status column added successfully ✅");
            }
            await sequelize.query("UPDATE canteens SET status = 'active' WHERE status IS NULL OR status = ''");

            const canteenCount = await sequelize.models.Canteen.count();
            if (canteenCount === 0) {
                console.log("[db] Seeding default canteens...");
                await sequelize.models.Canteen.bulkCreate([
                    { id: "main", name: "CSE Canteen", name_ta: "சி.எஸ்.இ உணவகம்", loc: "Block A · Ground floor", loc_ta: "பிளாக் ஏ · தரைத்தளம்", level: "low", wait: 3, status: "active" },
                    { id: "hostel", name: "S&H Canteen", name_ta: "எஸ் & ஹெச் உணவகம்", loc: "Block D", loc_ta: "பிளாக் டி", level: "high", wait: 14, status: "active" },
                    { id: "library", name: "Mech Canteen", name_ta: "மெக் உணவகம்", loc: "Block C · 1st floor", loc_ta: "பிளாக் சி · 1ஆம் தளம்", level: "med", wait: 7, status: "active" },
                ]);
                console.log("[db] Default canteens seeded ✅");
            }
        } catch (migErr) {
            console.warn("[db] Canteen status column migration check:", migErr.message);
        }

        // Safe auto-migration: ensure googleId column exists on users table
        try {
            const queryInterface = sequelize.getQueryInterface();
            const userTableDesc = await queryInterface.describeTable("users");
            if (!userTableDesc.googleId) {
                console.log("[db] Adding googleId column to users table...");
                await queryInterface.addColumn("users", "googleId", {
                    type: sequelize.Sequelize.STRING(100),
                    allowNull: true,
                });
                console.log("[db] googleId column added successfully ✅");
            }
            await sequelize.query("CREATE UNIQUE INDEX IF NOT EXISTS users_google_id_unique ON users(googleId);");
        } catch (migErr) {
            console.warn("[db] User googleId column migration check:", migErr.message);
        }

        console.log("[db] All tables synced ✅");

        httpServer.listen(PORT, () => {
            console.log(
                `[server] Canteen backend running on http://localhost:${PORT}`
            );
            console.log(`[server] Client URL: ${CLIENT_URL}`);
        });
    })
    .catch((error) => {
        console.error("[db] Database connection failed:", error.message);
        process.exit(1);
    });