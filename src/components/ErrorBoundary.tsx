import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from './ErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('A.S.T.R.A Portal Error Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: undefined })}
          onNavigateHome={() => {
            this.setState({ hasError: false, error: undefined });
            window.location.href = '/';
          }}
        />
      );
    }

    return this.props.children;
  }
}
