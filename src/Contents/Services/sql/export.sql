SELECT agents.Nom,
       agents.Prenom,
	   DATE_FORMAT(agents.DatNai,'%d/%m/%Y'),
	   DATE_FORMAT(ageetat.DatEta,'%d/%m/%Y'),
       grades.LibGra,
       unites.LibUni,
       subdis.LibSub,
       ageetat.Arrivee,
       ageetat.Motif,
       position.Position,
       etablissements.LibEts
  FROM    (   (   (   (   (   bpclight.unites unites
                           INNER JOIN
                              bpclight.etablissements etablissements
                           ON (unites.Kets = etablissements.Kets))
                       RIGHT OUTER JOIN
                          bpclight.agents agents
                       ON (agents.Kuni = unites.Kuni))
                   LEFT OUTER JOIN
                      bpclight.ageetat ageetat
                   ON (agents.Kage = ageetat.Kage))
               INNER JOIN
                  bpclight.position position
               ON (ageetat.Kpst = position.Kpst))
           INNER JOIN
              bpclight.grades grades
           ON (agents.Kgra = grades.Kgra))
       INNER JOIN
          bpclight.subdis subdis
       ON (agents.Ksub = subdis.Ksub)
 WHERE
	agents.kage in ({kage})