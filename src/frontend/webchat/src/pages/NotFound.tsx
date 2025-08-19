import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-vs-purple font-mono">404</h1>
        <p className="text-xl text-muted-foreground mb-4 font-mono">Oops! Página não encontrada</p>
        <a href="/lobby" className="text-vs-purple hover:text-vs-glow underline font-mono">
          ← Voltar ao DevChat
        </a>
      </div>
    </div>
  );
};

export default NotFound;
