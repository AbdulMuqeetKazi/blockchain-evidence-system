import { Link } from "react-router";
import { AlertTriangle, Home } from "lucide-react";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0F19] dark flex items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <CardBody className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 border border-[#EF4444]/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-[#EF4444]" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-white mb-4">Page Not Found</h2>

          <p className="text-[#9CA3AF] mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link to="/">
            <Button size="lg">
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
