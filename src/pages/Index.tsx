import { PitchCurveEditor } from "@/components/PitchCurveEditor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Pitch Curve Editor</h1>
      <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <PitchCurveEditor />
      </div>
    </div>
  );
};

export default Index;