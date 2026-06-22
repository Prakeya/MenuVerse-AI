import type { Response } from "express";

const channels = new Map<string, Set<Response>>();

export function subscribe(channel: string, res: Response): void {
  if (!channels.has(channel)) channels.set(channel, new Set());
  channels.get(channel)!.add(res);
}

export function unsubscribe(channel: string, res: Response): void {
  channels.get(channel)?.delete(res);
  if (channels.get(channel)?.size === 0) channels.delete(channel);
}

export function broadcast(channel: string, event: string, data: unknown): void {
  const subs = channels.get(channel);
  if (!subs || subs.size === 0) return;
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of subs) {
    try { res.write(msg); } catch { subs.delete(res); }
  }
}
