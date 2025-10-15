import ConfirmResetClient from './ConfirmResetClient';

export default function Page({
  params,
}: {
  params: { uid: string; token: string };
}) {
  return <ConfirmResetClient uid={params.uid} token={params.token} />;
}