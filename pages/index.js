export default function Index() { return null; }

export async function getServerSideProps() {
  return {
    redirect: { destination: '/livingroom/sw1', permanent: false }
  };
}


