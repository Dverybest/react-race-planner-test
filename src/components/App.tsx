import { Fragment, useEffect, useState, useCallback } from "react";
import { deleteStageRace, getStageRaces } from "../api";
import { IStageRace } from "../types";
import AddStageRaceModal from "./AddStageRaceModal";
import {
  Container,
  ErrorOverlay,
  LoadingSpinner,
  PrimaryButton,
  StageRaceListGroup,
  StageRaceListGroupItem,
} from "./shared";
import { Error, getDuration } from "./utils";

const App = () => {
  const [stageRaces, setStageRaces] = useState<IStageRace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAddRace, setShowAddRace] = useState<boolean>(false);
  const [error, setError] = useState<Error>({ show: false, message: "" });
  const sortStageRaces = (stageRaces: IStageRace[]) => {
    return stageRaces.sort((a: IStageRace, b: IStageRace) => {
      return new Date(a.stages[0].date).getTime() <
        new Date(b.stages[0].date).getTime()
        ? -1
        : new Date(a.stages[0].date).getTime() <
          new Date(b.stages[0].date).getTime()
        ? 1
        : 0;
    });
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
      fetchStageRaces();
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
      <AddStageRaceModal
        showAddRace={showAddRace}
        setStageRaces={setStageRaces}
        setShowAddRace={setShowAddRace}
        setError={setError}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Fragment>
          <StageRaceListGroup data-testid="mmm">
            {stageRaces.map((stageRace) => {
              return (
                <StageRaceListGroupItem
                  key={stageRace.id}
                  id={stageRace.id}
                  name={stageRace.name}
                  date={stageRace?.stages[0].date}
                  duration={getDuration(stageRace?.stages ?? [])}
                  onDelete={() => deleteItem(stageRace.id)}
                />
              );
            })}
          </StageRaceListGroup>
          {!stageRaces.length && <p>No stage races</p>}
          <PrimaryButton onClick={() => setShowAddRace(true)}>
            Add Stage Race
          </PrimaryButton>
        </Fragment>
      )}
    </Container>
  );
};

export default App;
