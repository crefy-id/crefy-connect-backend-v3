import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { RegisterRoutes } from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { mongodb_config } from './config'; // Import your MongoDB config

const app: Express = express();
const PORT = process.env.PORT || 8003;

// MongoDB connection function
async function connectDB() {
    try {
        await mongoose.connect(mongodb_config.mongoUri);

        console.log('✅ MongoDB connected successfully');
        // MongoDB connection event handlers
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        console.error(
            `🔗 Connection URI: ${mongodb_config.mongoUri.replace(
                /:\/\/[^@]+@/,
                '://***:***@',
            )}`,
        );
        process.exit(1);
    }
}

// Initialize database connection first
connectDB().then(() => {
    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(cors());

    // Logging middleware
    app.use(morgan('combined'));

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Load Swagger JSON - Improved path handling
    let swaggerDocument;
    const swaggerPaths = [
        path.join(__dirname, './docs/swagger.json'),
        path.join(__dirname, '../src/docs/swagger.json'),
        path.join(process.cwd(), 'src/docs/swagger.json'),
        path.join(process.cwd(), 'dist/docs/swagger.json'),
    ];

    for (const swaggerPath of swaggerPaths) {
        try {
            if (fs.existsSync(swaggerPath)) {
                swaggerDocument = JSON.parse(
                    fs.readFileSync(swaggerPath, 'utf-8'),
                );
                console.log(`✅ Swagger JSON loaded from: ${swaggerPath}`);
                break;
            }
        } catch (error) {
            continue;
        }
    }

    if (!swaggerDocument) {
        console.warn(
            '❌ Swagger JSON not found. Generating minimal documentation.',
        );
        swaggerDocument = {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation',
                version: '1.0.0',
                description: 'Swagger documentation is being generated...',
            },
            paths: {},
        };
    }

    const swaggerOptions = {
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            docExpansion: 'list',

            filter: true,
            tryItOutEnabled: false,
            operationsSorter: 'alpha', 
            tagsSorter: 'alpha',
            defaultModelsExpandDepth: 3, // Show models expanded
            defaultModelExpandDepth: 3, // Show model properties expanded
            displayOperationId: false,
            showCommonExtensions: true,
            showExtensions: true,

        },
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Crefy Connect API Documentation',
    };

    // Serve Swagger UI
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, swaggerOptions),
    );

    // Register tsoa-generated routes
    try {
        RegisterRoutes(app);
        console.log('✅ TSOA routes registered successfully');
    } catch (error) {
        console.error('❌ Failed to register TSOA routes:', error);
    }

    // Health check endpoint with DB status
    app.get('/api/health', (req: Request, res: Response) => {
        const dbStatus = mongoose.connection.readyState;
        const statusMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };

        res.status(200).json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
            database: {
                status:
                    statusMap[dbStatus as keyof typeof statusMap] || 'unknown',
                readyState: dbStatus,
            },
        });
    });

    // Root endpoint
    app.get('/api', (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: 'Welcome to the API',
            version: '1.0.0',
            endpoints: {
                auth: '/api/auth',
                emailAuth: '/api/auth/email',
                smsAuth: '/api/auth/sms',
                ensSubname: '/api/auth/ens',
                balane: '/api/balance',
                health: '/api/health',
                docs: '/api-docs',
            },
        });
    });

    // 404 handler
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: `Route not found: ${req.method} ${req.originalUrl}`,
            },
        });
    });

    // Global error handling middleware
    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
        console.error('Global error handler:', error);

        // Handle ApiError instances first
        if (error.statusCode && error.code) {
            return res.status(error.statusCode).json({
                success: false,
                error: {
                    code: error.code,
                    message: error.message,
                },
            });
        }

        // Handle TSOA validation errors
        if (error.status && error.fields) {
            return res.status(error.status).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Request validation failed',
                    details: error.fields,
                },
            });
        }

        // Handle MongoDB connection errors
        if (
            error.name === 'MongoServerSelectionError' ||
            (error.name === 'MongooseError' &&
                error.message.includes('buffering timed out'))
        ) {
            return res.status(503).json({
                success: false,
                error: {
                    code: 'DATABASE_UNAVAILABLE',
                    message: 'Database connection unavailable',
                },
            });
        }

        // Handle MongoDB timeout errors
        if (
            error.name === 'MongoNetworkError' ||
            error.message?.includes('timed out')
        ) {
            return res.status(503).json({
                success: false,
                error: {
                    code: 'DATABASE_TIMEOUT',
                    message: 'Database operation timed out',
                },
            });
        }

        // Mongoose validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: Object.values(error.errors)
                        .map((err: any) => err.message)
                        .join(', '),
                },
            });
        }

        // Mongoose duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'DUPLICATE_ENTRY',
                    message: 'Resource already exists',
                },
            });
        }

        // JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid token',
                },
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token has expired',
                },
            });
        }

        // Default error
        const statusCode = error.status || error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message:
                    process.env.NODE_ENV === 'production'
                        ? 'Internal server error'
                        : error.message,
            },
        });
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
        console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
        console.log(
            `🗄️  Database: ${
                mongoose.connection.readyState === 1
                    ? '✅ Connected'
                    : '❌ Disconnected'
            }`,
        );
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
});

export default app;
