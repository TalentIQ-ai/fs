import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import RenderRouter from "./render-router";

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#025CB8] border-t-transparent" />
    </div>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <RenderRouter />
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;