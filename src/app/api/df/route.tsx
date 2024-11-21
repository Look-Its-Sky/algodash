import { NextResponse } from 'next/server';

let dfs = {};

export async function GET(req: Request) {
  return NextResponse.json(dfs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const symbol = data['symbol'];
  const k = data['bot'] 
  dfs[k] = data;

  console.log(dfs);

  return NextResponse.json({ message: 'Data received' });
}

