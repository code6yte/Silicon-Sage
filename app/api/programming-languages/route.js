import { getProgrammingLanguages } from '@/app/lib/languages';

export async function GET() {
  try {
    const languages = await getProgrammingLanguages();
    return Response.json(languages);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
