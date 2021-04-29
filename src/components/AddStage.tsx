import React, {
  Fragment,
  useState,
  MouseEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import uniqid from "uniqid";
import { IStage } from "../types";
import {
  ButtonWrapper,
  DangerOutlineButton,
  FormInputGroup,
  SuccessOutlineButton,
} from "./shared";

interface Props {
  setIsAddStageOpen: Dispatch<SetStateAction<boolean>>;
  setStages: Dispatch<SetStateAction<IStage[]>>;
  stages: IStage[];
}
const AddStage = ({ setIsAddStageOpen, setStages, stages }: Props) => {
  const [stageObj, setStageObj] = useState<IStage>({
    id: "",
    name: "",
    date: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newState = { [e.target.name]: e.target.value };
    setStageObj((prevState) => {
      return {
        ...prevState,
        ...newState,
      };
    });
  };
  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    setStages((prevState: IStage[]) => [
      ...prevState,
      { ...stageObj, id: uniqid() },
    ]);
    setStageObj({
      id: "",
      name: "",
      date: "",
    });
    setIsAddStageOpen(false);
  };
  return (
    <Fragment>
      <h4>Add Stage</h4>
      <FormInputGroup
        label={"Name"}
        name={"name"}
        type={"text"}
        id={"add-stage-text-input-with-label"}
        value={stageObj.name}
        onChange={handleChange}
      />
      <FormInputGroup
        label={"Date"}
        type={"date"}
        name={"date"}
        id={"add-stage-date-input-with-label"}
        value={stageObj.date}
        onChange={handleChange}
      />
      <ButtonWrapper>
        <SuccessOutlineButton
          onClick={handleSave}
          disabled={stageObj.name.length === 0 || stageObj.date.length === 0}
        >
          Save
        </SuccessOutlineButton>
        <DangerOutlineButton onClick={() => setIsAddStageOpen(false)}>
          Cancel
        </DangerOutlineButton>
      </ButtonWrapper>
    </Fragment>
  );
};
export default AddStage;
