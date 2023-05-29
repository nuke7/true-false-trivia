import SearchContextProvider from "@/context/SearchContextProvider";
import "./global.css";

export const metadata = {
  title: "True or False App",
  description: "100% free and open source quiz app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-800 text-slate-100">
        <SearchContextProvider>{children}</SearchContextProvider>
      </body>
    </html>
  );
}

