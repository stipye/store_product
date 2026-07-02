import { Route, Switch, useLocation } from "wouter";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingChat from "./components/FloatingChat";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Admin from "./pages/Admin";

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-3xl">🧭</p>
      <h1 className="mt-4 text-2xl font-black text-gray-900">Página não encontrada</h1>
      <p className="mt-2 font-semibold text-gray-500">
        O endereço acessado não existe.
      </p>
    </div>
  );
}

export default function App() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {!isAdmin && <Header />}

      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/produto/:id" component={ProductPage} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingChat />}
    </div>
  );
}
