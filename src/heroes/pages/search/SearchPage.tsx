import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import { CustomBreadCumbs } from "@/components/custom/CustomBreadCumbs";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { useQuery } from "@tanstack/react-query";
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";
import { useSearchParams } from "react-router";

export const SearchPage = () => {

    const [searchParams] = useSearchParams();

    const name = searchParams.get('name') ?? '';
    const team = searchParams.get('team') ?? '';
    const category = searchParams.get('category') ?? '';
    const universe = searchParams.get('universe') ?? '';
    const status = searchParams.get('status') ?? '';
    const strength = searchParams.get('strength') ?? '';

    const { data: heroes = [] } = useQuery({
        queryKey: ['heroes', 'search', {
            name,
            team,
            category,
            universe,
            status,
            strength,
        }],
        queryFn: () => searchHeroesAction({ name, team, category, universe, status, strength }),
        staleTime: 1000 * 60 * 1, // 1 minutos
    });

    return (
        <>
            <CustomJumbotron title="Busqueda de heroes" description="Descubre, explora y administra super héroes y villanos" />

            {/* Breadcumbs */}
            <CustomBreadCumbs
                currentPage="Buscador de Héroes"
                breadcrumbs={[
                    { label: 'Home1', to: '/' },
                    { label: 'Home2', to: '/' },
                    { label: 'Home3', to: '/' },
                ]}
            />
            {/* Stats Dashboard */}
            <HeroStats />

            {/* Filter and search */}
            <SearchControls />

            <HeroGrid heroes={heroes ?? []} />
        </>
    )
}

export default SearchPage;