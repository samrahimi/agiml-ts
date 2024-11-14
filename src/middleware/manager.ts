// middleware/manager.ts
export class MiddlewareManager {
  private middlewares: Middleware[] = [];

  addMiddleware(middleware: Middleware) {
    // Prevent duplicate middleware
    if (!this.middlewares.find(m => m.name === middleware.name)) {
      this.middlewares.push(middleware);
    }
  }

  removeMiddleware(name: string) {
    this.middlewares = this.middlewares.filter(m => m.name !== name);
  }

  async runBeforeMiddleware(context: MiddlewareContext): Promise<MiddlewareContext> {
    let currentContext = { ...context };
    
    for (const middleware of this.middlewares) {
      if (middleware.beforeRequest) {
        currentContext = await middleware.beforeRequest(currentContext);
      }
    }
    
    return currentContext;
  }

  async runAfterMiddleware(context: MiddlewareContext): Promise<MiddlewareContext> {
    let currentContext = { ...context };
    
    // Run after middleware in reverse order
    for (const middleware of [...this.middlewares].reverse()) {
      if (middleware.afterResponse) {
        currentContext = await middleware.afterResponse(currentContext);
      }
    }
    
    return currentContext;
  }
}
