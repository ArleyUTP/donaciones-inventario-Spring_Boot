package org.humanitarian.donaciones_inventario;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.hibernate.spatial.dialect.postgis.PostgisPG95Dialect;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

@Configuration
public class HibernateConfig {

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        HibernateJpaVendorAdapter hibernateJpaVendorAdapter = new HibernateJpaVendorAdapter();
        hibernateJpaVendorAdapter.setDatabasePlatform(PostgisPG95Dialect.class.getName());
        return hibernateJpaVendorAdapter;
    }
}
