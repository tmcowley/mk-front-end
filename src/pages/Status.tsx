function Status() {
  const InactiveApiNotification = ({ hidden }: { hidden: boolean }) => (
    <div id="inactiveNotification" hidden={hidden}>
      Back-end services are inactive - apologies for any inconvenience
    </div>
  );

  return <InactiveApiNotification hidden={false} />;
}

export default Status;
