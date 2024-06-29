import type { FunctionComponent } from "react";

import { Container } from "../Container";

export const Header: FunctionComponent = () => {
  return (
    <header className="py-10">
      <Container>
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            My Blog
          </a>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
};
