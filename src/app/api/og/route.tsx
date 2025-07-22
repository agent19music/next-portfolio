import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import Image from 'next/image';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL or use defaults
    const title = searchParams.get('title') || 'Sean Motanya';
    const description =
      searchParams.get('description') ||
      "Software Developer. I love building beautiful and efficient things that serve humanity.";

    // Monochrome palette
    const charcoal = '#18181b'; // very dark gray/charcoal
    const charcoal2 = '#232326'; // slightly lighter charcoal
    const offWhite = '#f3f4f6'; // off white
    const midGray = '#a1a1aa'; // for subtle text
    const borderGray = '#27272a'; // for borders

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: charcoal,
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #232326 2%, transparent 0%), radial-gradient(circle at 75px 75px, #232326 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '900px',
              textAlign: 'center',
              padding: '60px',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '60px',
                backgroundColor: charcoal2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
                fontSize: '48px',
                fontWeight: 'bold',
                color: offWhite,
              }}
            >
        <Image src="https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/Open%20Peeps%20-%20Avatar-smile.png" alt="Sean Motanya" width={120} height={120} />              
            </div>
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: offWhite,
                margin: '0 0 20px 0',
                lineHeight: '1.2',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '28px',
                color: midGray,
                margin: '0 0 40px 0',
                lineHeight: '1.4',
                maxWidth: '700px',
              }}
            >
              {description}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {['Python', 'Typescript', 'Kotlin', 'Figma', 'Next.js', 'Node.js', 'Postgres', 'Docker', 'Flask', 'Tailwind CSS', 'React Native', 'PHP', 'Laravel', 'React'].map((tech) => (
                <div
                  key={tech}
                  style={{
                    backgroundColor: charcoal2,
                    color: offWhite,
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: '500',
                    border: `1px solid ${borderGray}`,
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: charcoal2,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}