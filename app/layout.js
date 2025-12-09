import { Inter } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer'
import { DataProvider } from './context/DataContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Silicon Sage",

  description: "where you find every thing about \"IT\" ",
  icons: {
    icon: '/favicon.png' // /public path
  },
};

export default function RootLayout({ children}) {
  return (
    <html lang="en">
      
      <body className={`${inter.className} bg-primary`}>
          <DataProvider>
            {children}
          </DataProvider>
       <Footer/>
      </body>
    </html>
  );
}
