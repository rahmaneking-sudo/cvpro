import PortfolioEditor from '../components/portfolio/PortfolioEditor';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export default function PortfolioEditorPage() {
  return (
    <ErrorBoundary>
      <PortfolioEditor />
    </ErrorBoundary>
  );
}
