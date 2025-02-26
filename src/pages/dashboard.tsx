import styled from "styled-components";
import useTags from "../hooks/fetching/useTags";
import TagItem from "../components/Tag";

const Dashboard = styled.section`
  width: 50%;
  margin: auto;

  display: grid;
  grid-template-columns: 1fr 0.6fr;
  gap: 30px;

  justify-items: space-around;
`;

const ItemsLayout = styled.div``;
const Section = styled.section`
  height: 500px;
  h2 {
    margin-top: 0;
  }
`;

const InOutSection = styled(Section)`
  display: grid;
  grid-template-rows: 1fr 1fr;
`;

const DashboardPage = () => {
  const { data: tags } = useTags();

  return (
    <>
      <h1>DashboardPage</h1>
      <Dashboard>
        <InOutSection>
          <div>
            <h2>Incoming</h2>
            <ItemsLayout>
              {tags?.map((tag) => {
                return <TagItem tag={tag} />;
              })}
            </ItemsLayout>
          </div>
          <div>
            <h2>Outgoing</h2>
            <ItemsLayout>
              {tags?.map((tag) => {
                return <TagItem tag={tag} />;
              })}
            </ItemsLayout>
          </div>
        </InOutSection>
        <Section>
          <h2>Tags</h2>
          <ItemsLayout>
            {tags?.map((tag) => {
              return <TagItem tag={tag} />;
            })}
          </ItemsLayout>
        </Section>
      </Dashboard>
    </>
  );
};

export default DashboardPage;
