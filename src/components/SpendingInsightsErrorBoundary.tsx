import React from "react";
import { Card } from "./utils/card";

interface InsightsErrorBoundaryProps {
  children: React.ReactNode;
}

interface InsightsErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class InsightsErrorBoundary extends React.Component<
  InsightsErrorBoundaryProps,
  InsightsErrorBoundaryState
> {
  constructor(props: InsightsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): InsightsErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("SpendingInsights error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card radius="12px" padding="16px">
          <div style={{ color: "#f44336", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>Unable to load spending insights</h3>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
              There was an error displaying your spending data. Please refresh the page or try again later.
            </p>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default InsightsErrorBoundary;