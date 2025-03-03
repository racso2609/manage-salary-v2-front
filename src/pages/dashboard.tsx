import styled from "styled-components";
import useTags from "../hooks/fetching/useTags";
import TagItem from "../components/Tag";
import useRecords from "../hooks/fetching/useRecords";
import RecordItem from "../components/Record";
import { Card } from "../components/utils/card";
import useDashboardInfo from "../hooks/fetching/useDashboardInfo";
import RecordsChart from "../components/RecordsChart";
import { useState } from "react";

const Dashboard = styled.section`
  margin: auto;

  width: 90%;
  gap: 20px;
  display: flex;
  flex-direction: column;

  h2 {
    margin-top: 0;
  }
`;

const ItemsLayout = styled.div`
  display: flex;
  flex-direction: column;

  background: gray;
  border-radius: 10px;
  height: 500px;
  overflow-y: auto;
`;

const ListsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  justify-content: space-around;
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 10px 0px;
  gap: 20px;

  p {
    margin: 0;
  }

  .total-section {
    display: flex;
    justify-content: space-between;
  }

  [data-profit="true"] {
    color: green;
  }

  [data-profit="false"] {
    color: red;
  }

  .subtotal-section {
    display: flex;
    h3 {
      margin: 0;
    }
    h3:last-child {
      margin-left: 25px;
    }
  }

  .total-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .chart-section {
    display: flex;
  }
`;

const DashboardPage = () => {
  const { data: tags, mutate: mutateTags } = useTags();
  const { data: recordsIn, mutate: mutateIn } = useRecords({
    type: "in",
    limit: 1000000,
  });
  const { data: recordsOut, mutate: mutateOut } = useRecords({
    type: "out",
    limit: 1000000,
  });
  const { data, mutate: mutateDashboard } = useDashboardInfo();
  const [chartType, setCharType] = useState<string>("out");

  const handleDelete = (recordId: string, recordType?: "in" | "out") => {
    if (recordType === "in")
      mutateIn((data) => data?.filter((r) => r._id !== recordId));
    else if (recordType === "out")
      mutateOut((data) => data?.filter((r) => r._id !== recordId));
    else mutateTags((data) => data?.filter((t) => t._id !== recordId));

    mutateDashboard();
  };

  return (
    <Dashboard>
      <Header>
        <Card
          background="gray"
          width={"100%"}
          radius="10px"
          className="total-container"
        >
          <section className="total-section">
            <h2>TOTAL:</h2>
            <h2 data-profit={(data?.total || 0) > 0}> {data?.total} USD</h2>
          </section>
          <section>
            {Object.keys(data?.subTotal ?? {}).map((type) => {
              return (
                <div
                  className="subtotal-section"
                  onClick={() => setCharType(type)}
                  key={type}
                >
                  <h3>{type}:</h3>
                  <h3 data-profit={type === "in"}>{data?.subTotal[type]}</h3>
                </div>
              );
            })}
          </section>
        </Card>
        <Card
          background="gray"
          width={"100%"}
          radius="10px"
          className="chart-section"
        >
          {chartType === "in" && (
            <>
              <h2>Incoming</h2>
              <RecordsChart records={recordsIn ?? []} />
            </>
          )}

          {chartType === "out" && (
            <>
              <h2>Outgoing</h2>
              <RecordsChart records={recordsOut ?? []} />
            </>
          )}
        </Card>
      </Header>
      <ListsSection>
        <div>
          <h2>Incoming</h2>
          <ItemsLayout>
            {recordsIn?.map((record) => {
              return (
                <RecordItem
                  key={record._id}
                  record={record}
                  onDelete={() => handleDelete(record._id, record.type)}
                />
              );
            })}
          </ItemsLayout>
        </div>
        <div>
          <h2>Outgoing</h2>
          <ItemsLayout>
            {recordsOut?.map((record) => {
              return (
                <RecordItem
                  key={record._id}
                  onDelete={() => handleDelete(record._id, record.type)}
                  record={record}
                />
              );
            })}
          </ItemsLayout>
        </div>
        <div>
          <h2>Tags</h2>
          <ItemsLayout>
            {tags?.map((tag) => {
              return (
                <TagItem
                  key={tag._id}
                  tag={tag}
                  onDelete={() => handleDelete(tag._id)}
                />
              );
            })}
          </ItemsLayout>
        </div>
      </ListsSection>
    </Dashboard>
  );
};

export default DashboardPage;
