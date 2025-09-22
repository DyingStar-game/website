import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import Link from "next/link";
import type { News } from "./news-manager";
import { Typography } from "@components/DS/typography";
import { Badge } from "@ui/badge";
import Image from "next/image";

type NewCardProps = {
  news: News;
};

export const NewCard = (props: NewCardProps) => {
  const attributes = props.news.attributes;
  return (
    <Link href={`/news/${props.news.slug}`}>
      <Card className="transition-all hover:shadow-xl">
        <CardHeader className="h-fit">
          <div className="flex gap-4">
            {attributes.titleIcon && (
              <div className="text-5xl">{attributes.titleIcon}</div>
            )}
            <div className="flex flex-col justify-between gap-2">
              <CardTitle>{attributes.title}</CardTitle>
              <div className="flex gap-2">
                {attributes.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              alt={attributes.title}
              src={attributes.coverUrl}
              fill
              className="object-cover"
            />
          </div>
          <CardDescription>
            <Typography variant="p">{attributes.description}</Typography>
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

