import { NextRequest, NextResponse } from 'next/server';
import { r2, BUCKET_NAME, getPublicUrl } from '@/lib/r2-config'; // Adjust the import path as necessary

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate random filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to R2
    await r2.putObject({
      Bucket: BUCKET_NAME || '',
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }).promise();

    // Get the public URL
    const publicUrl = getPublicUrl(fileName);

    return NextResponse.json({ 
      success: true, 
      url: publicUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed' 
    }, { status: 500 });
  }
}

