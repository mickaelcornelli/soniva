import type { Metadata } from "next";
import { UserPlaylistView } from "@/features/playlists/components/user-playlist-view";

export const metadata: Metadata = {
  title: "Ma playlist",
  // Contenu personnel : jamais indexé.
  robots: { index: false },
};

interface UserPlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPlaylistPage({ params }: UserPlaylistPageProps) {
  const { id } = await params;
  return <UserPlaylistView id={id} />;
}
