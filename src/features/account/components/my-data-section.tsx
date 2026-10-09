"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/auth-provider";
import { routes } from "@/lib/routes";
import { ClearDeviceDataButton } from "./clear-device-data-button";
import { DeleteAccountPanel } from "./delete-account-panel";
import { ExportDataButton } from "./export-data-button";

function DataCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-pretty text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}

/** « Mes données » dans la bibliothèque : accès, portabilité et effacement (RGPD). */
export function MyDataSection() {
  const { state } = useAuth();

  return (
    <section aria-labelledby="mes-donnees" className="flex flex-col gap-4">
      <h2 id="mes-donnees" className="font-display text-xl font-semibold">
        Mes données
      </h2>
      <p className="max-w-2xl text-sm text-pretty text-muted">
        Tes données t&apos;appartiennent : tu peux les récupérer ou les effacer à tout moment. Le
        détail est dans la{" "}
        <Link href={routes.privacy} className="text-foreground underline underline-offset-4">
          politique de confidentialité
        </Link>
        .
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <DataCard
          title="Exporter mes données"
          description={
            state.status === "signed-in"
              ? "Un fichier JSON avec ton compte, ta bibliothèque, tes playlists, ton historique et tes statistiques."
              : "Un fichier JSON avec ce que Soniva garde dans ce navigateur : bibliothèque, écoutes et file de lecture."
          }
        >
          <ExportDataButton />
        </DataCard>
        {state.status === "signed-in" ? (
          <DataCard
            title="Supprimer mon compte"
            description="Efface ton compte et toutes les données associées, sur tous tes appareils."
          >
            <DeleteAccountPanel />
          </DataCard>
        ) : state.status === "signed-out" ? (
          <DataCard
            title="Effacer les données de cet appareil"
            description="Vide la bibliothèque, les écoutes et le lecteur enregistrés dans ce navigateur."
          >
            <ClearDeviceDataButton />
          </DataCard>
        ) : null}
      </div>
    </section>
  );
}
