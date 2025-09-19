import { AspectRatio } from "@ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import Link from "next/link";
import type { News } from "./news-manager";

type NewCardProps = {
  news: News;
};

export const NewCard = (props: NewCardProps) => {
  return (
    <Link href={`/news/${props.news.slug}`}>
      <Card className="transition-all hover:shadow-xl">
        <CardHeader className="h-fit">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
            <img
              src={props.news.attributes.coverUrl}
              alt={props.news.attributes.title}
              className="size-full object-cover"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle>{props.news.attributes.title}</CardTitle>
          <CardDescription>{props.news.attributes.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};
