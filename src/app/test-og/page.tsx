export default function TestOGPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Open Graph Test Page</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Generated OG Image Preview</h2>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src="/api/og" 
                alt="Generated Open Graph image"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Custom OG Image Preview</h2>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src="/api/og?title=Custom%20Title&description=This%20is%20a%20custom%20description%20for%20testing"
                alt="Custom Open Graph image"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Testing Tools</h2>
            <div className="space-y-3">
              <p className="text-gray-600">Use these tools to test your Open Graph implementation:</p>
              <ul className="list-disc list-inside space-y-2 text-blue-600">
                <li>
                  <a 
                    href="https://developers.facebook.com/tools/debug/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Facebook Sharing Debugger
                  </a>
                </li>
                <li>
                  <a 
                    href="https://cards-dev.twitter.com/validator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Twitter Card Validator
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/post-inspector/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn Post Inspector
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 