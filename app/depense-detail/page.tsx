import DepensedetailPage from "./DepensedetailPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const pathnames = await searchParams;
  const id: any = pathnames?.id?.toString();

  return <DepensedetailPage depense={id} />;
}
