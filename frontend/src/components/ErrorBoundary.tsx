import React, { Component } from "react";
import type { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  showDetails: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  toggleDetails = () => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { children, fallback } = this.props;

    // If a custom fallback is provided, use it
    if (hasError && fallback) {
      return fallback;
    }

    if (hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="shadow-lg rounded-xl p-8 max-w-lg w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-950">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-500 mt-4 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {error?.message ||
                  "An unexpected error occurred. Please try reloading the page."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                aria-label="Reload page"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoBack}
                className="px-5 py-2.5 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                aria-label="Go back to previous page"
              >
                Go Back
              </button>
              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={this.toggleDetails}
                  className="px-5 py-2.5 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                  aria-expanded={showDetails}
                  aria-controls="error-details"
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </button>
              )}
            </div>

            {showDetails && (
              <div
                id="error-details"
                className="mt-6 text-left p-4 rounded-lg bg-gray-100 dark:bg-zinc-900 overflow-x-auto max-h-64 scrollbar"
              >
                <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Error Details:
                </h2>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {error?.toString()}
                  {"\n"}
                  {errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>If the problem persists, please contact support.</p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
