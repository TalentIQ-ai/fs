import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

import fallbackRender from "./error-boundary/fallbackRender";
import FooterComponent from "./footer";
import HeaderComponent from "./header";

const LayoutComponent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <HeaderComponent />

      {/* CONTENT */}
      <main className="flex-1">
        <ErrorBoundary fallbackRender={fallbackRender}>
          <Suspense
            fallback={
              <div className="w-full h-full flex justify-center items-center py-20">
                <span>Loading...</span>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* FOOTER */}
      <FooterComponent />
    </div>
  );
};

export default LayoutComponent;