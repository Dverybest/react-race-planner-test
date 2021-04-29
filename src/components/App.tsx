import { Fragment, useEffect, useState, useCallback } from "react";
import { deleteStageRace, getStageRaces } from "../api";
import { IStage, IStageRace } from "../types";
import {
  Container,
  ErrorOverlay,
  LoadingSpinner,
  PrimaryButton,
  StageRaceListGroup,
  StageRaceListGroupItem,
} from "./shared";

interface Error {
  show: boolean;
  message: string;
}

const App = () => {
  const [stageRaces, setStageRaces] = useState<IStageRace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>({ show: false, message: "" });
  const sortStageRaces = (stageRaces: IStageRace[]) => {
    return stageRaces.sort((a: IStageRace, b: IStageRace) => {
      return a.stages[0].date < b.stages[0].date
        ? -1
        : a.stages[0].date < b.stages[0].date
        ? 1
        : 0;
    });
  };
  const sortStages = (stages: IStage[]) => {
    return stages.sort((a: IStage, b: IStage) => {
      return new Date(a.date) < new Date(b.date)
        ? -1
        : new Date(a.date) < new Date(b.date)
        ? 1
        : 0;
    });
  };
  const getDuration = (stages: IStage[]) => {
    const sortedStages = sortStages(stages);
    const newestDate = new Date(sortedStages[stages.length - 1].date);
    const oldestDate = new Date(sortedStages[0].date);
    const diffTime = Math.abs(newestDate.getTime() - oldestDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const fetchStageRaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getStageRaces();
      const sortedStageRaces = sortStageRaces(response);
      setStageRaces(sortedStageRaces);
      setIsLoading(false);
    } catch (error) {
      setError({ show: true, message: "Error loading stage races" });
      setIsLoading(false);
    }
  }, []);

  const deleteItem = async (id: number) => {
    try {
      await deleteStageRace(id);
      fetchStageRaces()
    } catch (error) {
      setError({ show: true, message: "Error deleting stage race" });
    }
  };

  useEffect(() => {
    fetchStageRaces();
  }, [fetchStageRaces]);

  return (
    <Container>
      {error.show && (
        <ErrorOverlay
          error={error.message}
          clearError={() => setError({ show: false, message: "" })}
        />
      )}
      <h1 className="mb-3">Stage Races</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Fragment>
          <StageRaceListGroup>
            {stageRaces.map((stageRace) => {
              const duration = getDuration(stageRace?.stages ?? []);
              return (
                <StageRaceListGroupItem
                  key={stageRace.id}
                  id={stageRace.id}
                  name={stageRace.name}
                  date={stageRace?.stages[0].date}
                  duration={
                    duration > 1 ? `${duration} days` : `${duration} day`
                  }
                  onDelete={() => deleteItem(stageRace.id)}
                />
              );
            })}
          </StageRaceListGroup>
          {!stageRaces.length && <p>No stage races</p>}
          <PrimaryButton>Add Stage Race</PrimaryButton>
        </Fragment>
      )}
    </Container>
  );
};

export default App;
