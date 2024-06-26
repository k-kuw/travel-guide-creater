import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Destination, DestinationsDataProps } from "@/types/travelGuide";
import { ChangeEvent, useEffect, useState } from "react";
import TravelGuideDialog from "./TravelGuideDialog";
import TravelGuideMap from "./TravelGuideMap";

function DestinationRegister({ onDataChange }: DestinationsDataProps) {
  const [destinationSeq, setDestinationSeq] = useState<number>(1);
  const [destination, setDestination] = useState<string>("");
  const [destinationList, setDestinationList] = useState<Destination[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [errorTitle, setErrorTitle] = useState("サーバーエラー");
  const [errorMessage, setErrorMessage] =
    useState("サーバーでエラーが発生しました。");

  function handleChangeDestination(e: ChangeEvent<HTMLInputElement>) {
    setDestination(e.target.value);
  }
  useEffect(() => {
    onDataChange(destinationList);
  }, [destinationList, onDataChange]);

  function onClickAddDistination() {
    if (destination === "") {
      return;
    }
    const params = {
      name: destination,
    };
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/map/search-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const destInfo = {
          id: destinationSeq,
          name: destination,
          lon: data.lon || null,
          lat: data.lat || null,
        };
        setDestinationSeq(destinationSeq + 1);
        setDestinationList([...destinationList, destInfo]);
        setDestination("");
      })
      .catch((error) => {
        if (error.message === "Not Found") {
          setErrorTitle("目的地不明");
          setErrorMessage(
            "目的地が見つかりませんでした。\n別の地名でお試しください。"
          );
        }
        setOpenDialog(true);
      });
  }
  function handleDeleteDestination(id: number) {
    const newDestList = destinationList.filter((dest) => dest.id !== id);
    setDestinationList(newDestList);
  }
  return (
    <div className="p-1">
      <div className="text-4xl font-semibold mb-4 font-mono">目的地</div>
      {destinationList.map((dest) => (
        <div key={dest.id}>
          {dest.name}
          <Button onClick={() => handleDeleteDestination(dest.id)}>削除</Button>
        </div>
      ))}
      <Input value={destination} onChange={(e) => handleChangeDestination(e)} />
      <Button
        type="button"
        className="w-full my-5"
        onClick={() => onClickAddDistination()}
      >
        目的地を追加
      </Button>
      {destinationList.length !== 0 && (
        <TravelGuideMap destinations={destinationList} />
      )}
      <TravelGuideDialog
        open={openDialog}
        setOpen={setOpenDialog}
        title={errorTitle}
        message={errorMessage}
      />
    </div>
  );
}

export default DestinationRegister;
