import { Fragment } from "react";
import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Fragment>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>Habit Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </Fragment>
  );
}
