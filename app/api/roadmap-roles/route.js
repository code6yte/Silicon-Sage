import { getRoadmapRoles } from '@/app/lib/roadmap';

export async function GET() {
  try {
    const roles = await getRoadmapRoles();
    return Response.json(roles);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
