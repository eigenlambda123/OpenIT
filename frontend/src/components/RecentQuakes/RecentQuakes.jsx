import {
  Flex,
  Heading,
} from "@chakra-ui/react";
import QuakeEntry from "./QuakeEntry";

function RecentQuakes({ quakeData }) {
  return (
    <Flex direction="column" gap="10px">
      <Heading size={["sm", "md"]}>Recent Earthquakes</Heading>
      <Flex direction="column" gap="2px" borderRadius="10px" overflow="hidden">
        {quakeData.map(data => (
          <QuakeEntry key={data.title} quakeData={data} />
        ))}
      </Flex>
    </Flex>
  );
}

export default RecentQuakes;
