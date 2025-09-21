    <Layout>
      {latestNews && (
        <LayoutContent>
          <NewCard key={latestNews.slug} news={latestNews} />
        </LayoutContent>
      )}
      <CtaWithButton
        size="xs"
        title="Join us and contribute to the project!"
        btContent="How to contribute"
      />
    </Layout>

}

