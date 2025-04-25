import RecettedetailPage from "./RecettedetailPage";
import DepensedetailPage from "./RecettedetailPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const pathnames = await searchParams;
  const id: any = pathnames?.id?.toString();

  return <RecettedetailPage depense={id} />;
}
