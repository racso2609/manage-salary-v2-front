import styled from "styled-components";
import useTags from "../hooks/fetching/useTags";
import TagItem from "../components/Tag";
import RecordItem from "../components/Record";
import { Card } from "../components/utils/card";
import useDashboardInfo from "../hooks/fetching/useDashboardInfo";
import RecordsChart from "../components/RecordsChart";
import { FC, useEffect, useMemo, useState } from "react";
import useRecords from "../hooks/fetching/useRecords";
import useIsOnViewPort from "../hooks/effects/useOnViewPort";
import useTag from "../hooks/fetching/useTag";
import useForm from "../hooks/forms/useForms";
import { Input } from "../components/Inputs";
import moment from "moment";
import { formatDate } from "../utils/formatter/date";

const Dashboard = styled.section`
  margin: auto;

  width: 90%;
  gap: 20px;
  display: flex;
  flex-direction: column;

  h2 {
    margin-top: 0;
    // margin-bottom: 0;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
    // display: flex;
  }
`;

const DateFilterSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  & > * {
    width: 100%;
    max-width: 200px;
  }

  @media (max-width: 500px) {
    & > * {
      width: 100%;
      max-width: unset;
    }
  }
`;

const RecordsSection: FC<{
  tag?: string;
  type: "in" | "out" | "all";
  limit?: number;
  from?: string;
  to?: string;
  onAction?: () => void;
}> = ({ tag: tagId, from, to, type, limit = 5, onAction }) => {
  const {
    data,
    mutate: mutateRecords,
    setSize: setPage,
  } = useRecords({
    tag: tagId,
    limit,
    type,
    from,
    to,
  });
  const [ref, entry] = useIsOnViewPort<HTMLDivElement>();

  const isVisiable = useMemo(() => {
    return entry?.isIntersecting;
  }, [entry]);

  const handleDelete = (recordId: string) => {
    mutateRecords((data) => {
      return data?.map((page) => {
        return page.filter((record) => record._id !== recordId);
      });
    });
    onAction?.();
  };

  useEffect(() => {
    if (!isVisiable) return;
    const shouldFetch =
      data?.length === 0 || data?.[data.length - 1]?.length === limit;
    if (!shouldFetch) return;

    setPage((prev) => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisiable, data, limit]);

  return (
    <div>
      <ItemsLayout>
        {data?.flat()?.map((record) => {
          return (
            <RecordItem
              key={record._id}
              record={record}
              onDelete={() => handleDelete(record._id)}
            />
          );
        })}
        <div ref={ref} style={{ width: "100%", height: 10 }}></div>
      </ItemsLayout>
    </div>
  );
};

const DashboardPage = () => {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const dateInput = useForm<{
    from: string;
    to: string;
  }>({
    id: "date-filter",
    defaultValue: {
      from: "",
      to: "",
    },
    type: "date",
  });

  const { data: tags, mutate: mutateTags } = useTags();

  const { data, mutate: mutateDashboard } = useDashboardInfo({
    tag: selectedTag,
    from: dateInput.value.from,
    to: dateInput.value.to,
  });
  const { in: recordsIn, out: recordsOut } = data?.records ?? {};

  const [chartType, setCharType] = useState<string>("out");
  const { data: tag } = useTag({ tagId: selectedTag ?? "" });

  const handleDelete = (tagId?: string) => {
    if (tagId) mutateTags((data) => data?.filter((t) => t._id !== tagId));
    mutateDashboard();
  };

  const handleTagSelection = (tagId: string) => {
    if (selectedTag === tagId) {
      setSelectedTag(undefined);
      return;
    }

    setSelectedTag(tagId);
  };

  const handleDate = (date: string, type: "from" | "to") => {
    console.log(date);
    if (!date) {
      dateInput.onChange({
        target: {
          value: {
            from: "",
            to: "",
          },
        },
      });
      return;
    }
    let from = moment(
      new Date(type === "from" ? date : dateInput.value.from),
    ).add(1, "day");

    let to = moment(new Date(type === "to" ? date : dateInput.value.to)).add(
      1,
      "day",
    );

    if (from.isAfter(to) && to.isValid()) {
      to = from.add(1, "week");
    } else if (to.isBefore(from) && from.isValid()) {
      from = to.subtract(1, "week");
    }

    dateInput.onChange({
      target: {
        value: {
          from: from.isValid() ? formatDate(from.toDate()) : "",
          to: to.isValid() ? formatDate(to.toDate()) : "",
        },
      },
    });
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
            {Object.keys({
              in: data?.subTotal.in,
              out: data?.subTotal?.out,
            }).map((type) => {
              return (
                <div
                  className="subtotal-section"
                  onClick={() => {
                    if (data?.subTotal?.[type]) setCharType(type);
                  }}
                  key={type}
                >
                  <h3>{type}:</h3>
                  <h3 data-profit={type === "in"}>
                    {data?.subTotal?.[type] || 0}
                  </h3>
                </div>
              );
            })}
            <h3>Selected Tag: {tag?.name || "ALL"}</h3>
          </section>
        </Card>
        <Card
          background="gray"
          width={"100%"}
          radius="10px"
          className="chart-section"
          padding="10px"
        >
          {chartType === "in" && (
            <>
              <h2>Incoming</h2>
              <RecordsChart
                records={recordsIn ?? []}
                onTagClick={handleTagSelection}
              />
            </>
          )}

          {chartType === "out" && (
            <>
              <h2>Outgoing</h2>
              <RecordsChart
                records={recordsOut ?? []}
                onTagClick={handleTagSelection}
              />
            </>
          )}
          <DateFilterSection>
            <p>from date</p>
            <Input
              {...dateInput}
              onChange={(e) => handleDate(e.target.value, "from")}
              value={dateInput.value.from}
            />

            <p>to date</p>
            <Input
              {...dateInput}
              onChange={(e) => handleDate(e.target.value, "to")}
              value={dateInput.value.to}
            />
          </DateFilterSection>
        </Card>
      </Header>
      <ListsSection>
        <div>
          <h2>Incoming</h2>
          <ItemsLayout>
            <RecordsSection
              type="in"
              onAction={() => handleDelete()}
              tag={selectedTag}
              from={dateInput.value.from}
              to={dateInput.value.to}
            />
          </ItemsLayout>
        </div>
        <div>
          <h2>Outgoing</h2>
          <ItemsLayout>
            <RecordsSection
              type="out"
              onAction={() => handleDelete()}
              tag={selectedTag}
              from={dateInput.value.from}
              to={dateInput.value.to}
            />
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
