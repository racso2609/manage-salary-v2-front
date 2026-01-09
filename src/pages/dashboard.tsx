import "../theme/types";
import styled from "styled-components";
import useTags from "../hooks/fetching/useTags";
import TagItem from "../components/Tag";
import RecordItem from "../components/Record";
import { Card } from "../components/utils/card";
import useDashboardInfo from "../hooks/fetching/useDashboardInfo";

import { useMemo, useState } from "react";
import useTag from "../hooks/fetching/useTag";
import useForm from "../hooks/forms/useForms";

import moment from "moment";
import { formatNumber } from "../utils/formatter/numbers";
import { Record } from "../types/manageSalaryTypes/records";

import RecordEditModal from "../components/RecordEditModal";
import useUpdateRecord from "../hooks/actions/useUpdateRecord";
import TotalContainer, { BalanceSection } from "../components/TotalContainer";
import TopCategories from "../components/TopCategories";
import RecentTransactions from "../components/RecentTransactions";
import SpendingInsights from "../components/SpendingInsights";
import InsightsErrorBoundary from "../components/SpendingInsightsErrorBoundary";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import ChartSection from "../components/ChartSection";

const Dashboard = styled.section`
  margin: auto;

  width: 90%;
  gap: 20px;
  display: flex;
  flex-direction: column;

  h2 {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    width: 95%;
    gap: 16px;
  }

  @media (max-width: 480px) {
    width: 98%;
    gap: 12px;
  }
`;

const ItemsLayout = styled.div`
  display: flex;
  flex-direction: column;

  background: gray;
  border-radius: 10px;
  height: 500px;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: 350px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  padding: 10px 0px;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 8px 0px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    padding: 6px 0px;
  }
`;

const ListsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  justify-content: space-around;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const AlertBanner = ({
  alerts,
}: {
  alerts: Array<{ type: string; message: string }>;
}) =>
  alerts.length > 0 && (
    <div style={{ marginBottom: "10px" }}>
      {alerts.map((alert, index) => (
        <Card
          key={index}
          background={alert.type === "warning" ? "#fff3cd" : "#f8d7da"}
          radius="10px"
          padding="10px"
        >
          <p
            style={{
              margin: 0,
              color: alert.type === "warning" ? "#856404" : "#721c24",
            }}
          >
            {alert.message}
          </p>
        </Card>
      ))}
    </div>
  );

const RecordsPerLabel = ({
  records,
  onDelete,
  onEdit,
}: {
  records: { [key: string]: { records: Record[]; total: string | number } };
  onDelete?: (recordId: string) => void;
  onEdit?: (record: Record) => void;
}) => {
  const [isOpenLabel, setIsOpenLabel] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleLabel = (date: string) => {
    setIsOpenLabel((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return Object.entries(records).map(([date, records]) => {
    return (
      <>
        <Card
          key={date}
          style={{ marginBottom: "10px" }}
          onClick={() => toggleLabel(date)}
        >
          <h3>{moment(date).format("MMMM YYYY")}</h3>
          <p
            className={
              Number(records.total) > 0 ? "success-text" : "danger-text"
            }
          >
            Total: {formatNumber(records.total)}
          </p>
        </Card>
        {isOpenLabel[date] &&
          records.records.map((record) => (
            <RecordItem
              key={record._id}
              record={record}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
      </>
    );
  });
};

const DashboardPage = () => {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"dashboard" | "analytics">(
    "dashboard",
  );
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

  const {
    data,
    mutate: mutateDashboard,
    isLoading,
  } = useDashboardInfo({
    tag: selectedTag,
    from: dateInput.value.from,
    to: dateInput.value.to,
  });
  const { data: fullYearData } = useDashboardInfo({});

  const [chartType, setCharType] = useState<string>("out");
  const { data: tag } = useTag({ tagId: selectedTag ?? "" });

  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { handleUpdateRecord } = useUpdateRecord({
    handlers: {
      onSuccess: () => {
        mutateDashboard();
      },
      onError: (err) => {
        console.error(err);
      },
    },
  });

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

  const handleEditRecord = (record: Record) => {
    setEditingRecord(record);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (
    data: Partial<Omit<Record, "tag"> & { tag: string }>,
  ) => {
    if (!editingRecord) return;
    handleUpdateRecord(editingRecord._id, data);
    setEditModalOpen(false);
    setEditingRecord(null);
  };

  // Calculate different balance views
  const currentYearBalance = useMemo(() => {
    // Current year balance - what user sees by default
    return data?.total || 0;
  }, [data]);

  const allTimeBalance = useMemo(() => {
    // All time balance - complete historical balance
    // For now, simulate a different value by adding previous balance
    // In production, this would come from a separate API call

    return fullYearData?.total || 0;
  }, [fullYearData?.total]);

  const topCategories = useMemo(() => {
    if (!data?.records || !tags) return [];
    const outflowByTag: { [key: string]: number } = {};
    Object.values(data.records).forEach((month) => {
      month.records.forEach((record) => {
        if (record.type === "out") {
          outflowByTag[record.tag._id] =
            (outflowByTag[record.tag._id] || 0) + Number(record.amount);
        }
      });
    });
    return Object.entries(outflowByTag)
      .map(([tagId, total]) => {
        const tag = tags.find((t) => t._id === tagId);
        return { tag, total };
      })
      .filter((item) => item.tag)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [data, tags]);

  const recentTransactions = useMemo(() => {
    if (!data?.records) return [];
    const allRecords = Object.values(data.records).flatMap(
      (month) => month.records,
    );
    return allRecords
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [data]);

  const alerts = useMemo(() => {
    const alertList: Array<{ type: string; message: string }> = [];
    const lowBalanceThreshold = parseFloat(
      localStorage.getItem("lowBalanceThreshold") || "500",
    );
    const highSpendingThreshold = parseFloat(
      localStorage.getItem("highSpendingThreshold") || "2000",
    );
    if (currentYearBalance < lowBalanceThreshold) {
      alertList.push({
        type: "warning",
        message: `Low Balance: Below $${lowBalanceThreshold}`,
      });
    }
    const totalExpenses = data?.subTotal?.out || 0;
    if (totalExpenses > highSpendingThreshold) {
      alertList.push({
        type: "danger",
        message: `High Spending: Over $${highSpendingThreshold} this period`,
      });
    }
    return alertList;
  }, [currentYearBalance, data]);

  const records = useMemo(() => {
    const recordsList = Object.values(data?.records ?? {})
      .flat()
      .map((record) => record.records)
      .flat();

    return recordsList
      .filter((record) => {
        if (chartType === "in") return record.type === "in";
        if (chartType === "out") return record.type === "out";
        return true;
      })
      .filter((record) => {
        // datefilter - if no date range specified, show all records
        if (!dateInput.value.from && !dateInput.value.to) {
          return true;
        }
        return moment(record.date).isBetween(
          dateInput.value.from || moment().subtract(100, "years"),
          dateInput.value.to || moment().add(100, "years"),
        );
      });
  }, [data, chartType, dateInput.value.from, dateInput.value.to]);

  // View Toggle Buttons
  const ViewToggle = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    padding: 4px;
    background: ${({ theme }) => theme.colors.borderLight}20;
    border-radius: 8px;
    width: fit-content;

    .toggle-button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: ${({ theme }) => theme.colors.primary};
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &:hover:not(.active) {
        background: ${({ theme }) => theme.colors.borderLight}40;
      }
    }

    @media (max-width: 480px) {
      margin-bottom: 16px;

      .toggle-button {
        padding: 6px 12px;
        font-size: 13px;
      }
    }
  `;

  return (
    <Dashboard>
      <AlertBanner alerts={alerts} />
      <ViewToggle>
        <button
          className={`toggle-button ${viewMode === "dashboard" ? "active" : ""}`}
          onClick={() => setViewMode("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`toggle-button ${viewMode === "analytics" ? "active" : ""}`}
          onClick={() => setViewMode("analytics")}
        >
          Analytics
        </button>
      </ViewToggle>

      {viewMode === "analytics" ? (
        <AnalyticsDashboard
          dateRange={{
            from: dateInput.value.from,
            to: dateInput.value.to,
          }}
          isLoading={isLoading}
        />
      ) : (
        <>
          <Card background="gray">
            <BalanceSection
              currentYearBalance={currentYearBalance}
              allTimeBalance={allTimeBalance}
            />
          </Card>

          <Header>
            <TotalContainer
              currentYearBalance={currentYearBalance}
              allTimeBalance={allTimeBalance}
              data={data}
              tag={tag}
              onChartTypeChange={setCharType}
              isLoading={isLoading}
              dateRange={{
                from: dateInput.value.from,
                to: dateInput.value.to,
              }}
            />
            <Card
              background="gray"
              width={"100%"}
              radius="10px"
              className="chart-section"
              padding="10px"
            >
              <ChartSection
                records={records}
                chartType={chartType as "in" | "out"}
                onTagClick={handleTagSelection}
                isLoading={isLoading}
                onRefresh={mutateDashboard}
                dateRange={{
                  from: dateInput.value.from ?? "",
                  to: dateInput.value.to ?? "",
                }}
                onDateRangeChange={(range) => {
                  dateInput.onChange({
                    target: {
                      value: {
                        from: range.from,
                        to: range.to,
                      },
                    },
                  });
                }}
              />
            </Card>
            <TopCategories
              topCategories={topCategories}
              onTagClick={handleTagSelection}
              isLoading={isLoading}
            />
            <RecentTransactions
              recentTransactions={recentTransactions}
              onTransactionClick={handleEditRecord}
              isLoading={isLoading}
            />
            <InsightsErrorBoundary>
              <SpendingInsights
                dateRange={{
                  from: dateInput.value.from,
                  to: dateInput.value.to,
                }}
              />
            </InsightsErrorBoundary>
          </Header>
          <ListsSection>
            <div>
              <h2>Records</h2>
              <ItemsLayout>
                {
                  <RecordsPerLabel
                    records={data?.records ?? {}}
                    onDelete={handleDelete}
                    onEdit={handleEditRecord}
                  />
                }
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
          <RecordEditModal
            open={editModalOpen}
            record={editingRecord}
            onClose={() => setEditModalOpen(false)}
            onSave={handleSaveEdit}
          />
        </>
      )}
    </Dashboard>
  );
};

export default DashboardPage;
