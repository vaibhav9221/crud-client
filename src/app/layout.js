import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
export default RootLayout;