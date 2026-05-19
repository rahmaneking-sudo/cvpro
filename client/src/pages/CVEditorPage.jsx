import CVEditor from '../components/cv/CVEditor';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export default function CVEditorPage() {
  return (
    <ErrorBoundary>
      <CVEditor />
    </ErrorBoundary>
  );
}
