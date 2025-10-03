########### TODO ###########

# [DyingStar - Webapp] Software Architecture

We plan to build the application using [Architecture] style.

## Architecture Diagram

![](architecture.png)

> We recommend building architecture using [Draw.io](https://app.diagrams.net/). Draw.io also has a desktop application.

You can also document your architecture using [C4Model](https://c4model.com/). We recommend C1(System Context) and C2(Container) diagrams.

> C4 model is a lean graphical notation technique for modelling the architecture of software systems. It is based on a structural decomposition of a system into containers and components and relies on existing modelling techniques such as the Unified Modelling Language (UML) or Entity Relation Diagrams (ERD) for the more detailed decomposition of the architectural building blocks.

## Technologies

The list of technologies we will use to build the application are as follows:

| Technology          | Purpose                | Version  |
| ------------------- | ---------------------- | -------- |
| [Java]              | [Programming Language] | [11.0.9] |
| [Postgres]          | [Database]             | [13.1]   |
| [Backend Framework] | [Spring Boot]          | [2.4.1]  |
| [Frontend]          | [React]                | [17.0.1] |

## Non-functional Requirements

Non-functional requirement for the project are:

| Quality Attribute | Description | Target |
| --- | --- | --- |
| [Performance] | [Transaction Response Time] | [2 seconds] |
| [Availability] | [System Uptime] | [99.9] |
| [Throughput] | [Number of requests/transactions per second at peak time] | [1000 RPS] |
| [Auditability] | [Ability of the application to show what has happened to it, who did it and when] | [A log file that captures the event with the timestamp] |
| [Reliability] | [Mean time to recovery] | [System should be able to recover from failure under 5 mins] |
| [Usability] | [Usability can be described as the capacity of a system to provide a condition for its users to perform the tasks safely, effectively, and efficiently while enjoying the experience] | [Browsers: Chrome, IE, Firefox] <br />[Screen Size] |

# Architecture Decision Records

## ADR-0001 - Microservices in a monorepo

- Status: <Draft, To be discussed, Under Consideration, Accepted>
- Deciders: [names]
- Date: <date>

### Context and Problem Statement

There will be two teams working on one FE, one GraphQL API and multiple BE microservices. We are about to take the learnings from the PoA into a the MVP product, by starting one monorepo or multiple repos per service.

### Considered Options

1. One repository containing one service per root directory
2. A repository per service

### Decision Outcome

A monorepo has been chosen, because all code is moving quickly in the beginning of the project and we don't want blocking dependencies or an inefficient development workflow. Since we will implement User Stories end to end, a single developer usually has to work in multiple services simultaneously, which is easier in a monorepo.

We will evaluate the decision after two Sprints.

#### Positive Consequences

- A monorepo will speed up development.
- Package dependencies can be managed using tools like Lerna or NX.
- We think it is easier to move from monorepo into multiple repos than to merge multiple repos into a monorepo.

#### Negative Consequences

- There is a risk of coupling we don't want with microservices.
- The unfiltered git history is mixed for the different services.
- Every developer gets access to all code, even when they are assigned to work on one service.

## ADR-0002 - GraphQL

## ADR-0003 - DevOps

## ADR-0004 - Styling solution

## ADR-0005 - CSS-in-JS solution

## ADR-0006 - Component library

## ADR-0007 - Component library setup

## ADR-0008 - Testing strategy

## ADR-0009 - Coding Style

## ADR-0010 - Performance testing

## ADR-0011 - Testing practices

## ADR-0012 - Frontend schema validation library

## ADR-0013 - Monorepo tooling

## ADR-0014 - Frontend folder naming

- Status: <Draft, To be discussed, Under Consideration, Accepted>
- Deciders: [names]
- Date: <date>

### Context and Problem Statement

As the project organically grew, adhoc decision were made around the naming of the folders, eventually leading to small inconsistencies between the domains.

At the time of writing the structure is as follows:

- `app/customer/customer-edit-page/CustomerEditPage.tsx`
- `app/product/product-search-page/ProductSearchPage.tsx`

We want an improved and agreed upon way of naming our directories moving forward.

### Suggested Solution

The suggestion was made to make the folder naming more concise; removing the domain prefix and the page suffix in the folder naming, while keeping the file names and exports as is to preserve searchability.

The following change was suggested:

- `app/customer/customer-edit-page/CustomerEditPage.tsx` -> `app/customer/edit/CustomerEditPage.tsx`
- `app/product/product-search-page/ProductSearchPage.tsx` -> `app/product/search/ProductSearchPage.tsx`

To be added domains e.g. Order could be implemented using to the following naming convention:

```
product/
  ├── ...
customer/
  ├── ...
order/
  ├── view/
  │     ├── details/
  │     │      └── OrderDetails.tsx // only used by OrderViewPage
  │     └── OrderViewPage.tsx
  ├── create/
  │     └── OrderCreatePage.tsx
  ├── edit/
  │     └── OrderEditPage.tsx
  └── search/
        └── OrderSearchPage.tsx
```

### Decision Outcome

We've agreed on the suggested change of more concise naming for folders; by removing the domain and page prefix in the directories.

## ADR-0015 - Frontend shared components

- Status: <Draft, To be discussed, Under Consideration, Accepted>
- Deciders: [names]
- Date: <date>

### Context and Problem Statement

Where to store components that are shared between domains e.g. product, customer, etc

### Suggested Solution

Store components shared between domains under `/components/shared` directory.

### Decision Outcome

Agreed on suggested solution.

## ADR-0016 - Frontend component file order

## ADR-0017 - Organise styling code

## ADR-0018 - Cypress test selectors

## ADR-0019 - NodeJS / NPM version management

## ADR-0020 - PR Merge strategy

## ADR-0021 - Timestamps & timezones

## ADR-0022 - Code sharing style

## ADR-0023 - Testing GraphQL API
