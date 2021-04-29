import { Fragment, useState, Dispatch, SetStateAction } from "react";
import { addStageRace } from "../api";
import uniqid from "uniqid";
import { IProvisionalStageRace, IStage, IStageRace } from "../types";
import AddStage from "./AddStage";
import {
  ButtonWrapper,
  DangerOutlineButton,
  FormInputGroup,
  Modal,
  PrimaryOutlineButton,
  StageRaceFormStageListGroup,
  StageRaceFormStageListGroupItem,
  StageRaceFormTotals,
  SuccessOutlineButton,
} from "./shared";
import { Error, getDuration, sortStages } from "./utils";

interface Props {
  showAddRace: boolean;
  setShowAddRace: Dispatch<SetStateAction<boolean>>;
  setStageRaces: Dispatch<SetStateAction<IStageRace[]>>;
  setError: Dispatch<SetStateAction<Error>>;
}
const AddStageRaceModal = ({
  showAddRace,
  setShowAddRace,
  setStageRaces,
  setError,
}: Props) => {
  const [stageRace, setStageRace] = useState<IProvisionalStageRace>({
    name: "",
    stages: [],
  });
  const [isAddStageOpen, setIsAddStageOpen] = useState<boolean>(false);
  const [stages, setStages] = useState<IStage[]>([]);
  const handleDeleteStage = (id: string) => {
    setStages((prevState) => {
      return prevState.filter((stage) => stage.id !== id);
    });
  };
  const handSave = async () => {
    try {
      const response = await addStageRace({ ...stageRace, stages: stages });
      setStageRace({ name: "", stages: [] });
      setStageRaces((prevState) => [...prevState, response]);
      setShowAddRace(false);
    } catch (error) {
      setError({ show: true, message: "Error adding stage race" });
    }
  };
  return (
    <Modal isOpen={showAddRace}>
      {!isAddStageOpen ? (
        <Fragment>
          <h4>Add Stage Race</h4>
          <FormInputGroup
            id={"text-input-with-label"}
            placeholder={"Enter stage race name"}
            value={stageRace.name}
            onChange={(e) =>
              setStageRace((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
          />
          <h4>Stages</h4>

          <StageRaceFormStageListGroup>
            {stages.length > 0 ? (
              sortStages(stages).map((stage: IStage) => {
                return (
                  <StageRaceFormStageListGroupItem
                    id={stage.id}
                    key={stage.id}
                    date={stage.date}
                    name={stage.name}
                    onDelete={() => handleDeleteStage(stage.id)}
                  />
                );
              })
            ) : (
              <p>No stages</p>
            )}
          </StageRaceFormStageListGroup>
          <StageRaceFormTotals duration={getDuration(stages)} />
          <ButtonWrapper>
            <PrimaryOutlineButton
              onClick={() => setIsAddStageOpen(true)}
              disabled={stageRace.name.length === 0}
            >
              Add Stage
            </PrimaryOutlineButton>
            <SuccessOutlineButton
              onClick={handSave}
              disabled={stages.length < 1}
            >
              Save
            </SuccessOutlineButton>
            <DangerOutlineButton onClick={() => setShowAddRace(false)}>
              Cancel
            </DangerOutlineButton>
          </ButtonWrapper>
        </Fragment>
      ) : (
        <AddStage
          setIsAddStageOpen={setIsAddStageOpen}
          stages={stages}
          setStages={setStages}
        />
      )}
    </Modal>
  );
};
export default AddStageRaceModal;
